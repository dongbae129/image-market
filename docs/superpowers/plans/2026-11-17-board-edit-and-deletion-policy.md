# Board 수정·삭제 정책 구현 계획

**목표:** 작성자 전용 Board 수정 및 물리 삭제를 명시된 정책에 맞게 완성한다.

**범위:** API 소유권 검사, Board 수정 폼 연결, 설정 UI 접근 제어, 문서화. 테스트 코드는 추가하지 않는다.

**정책:** [Board 수정·삭제 정책 설계](../specs/2026-11-17-board-edit-and-deletion-policy-design.md)

## 작업

- [x] 기존 Board 관계 확인: 댓글, 태그, 조회 기록, 이미지 참조는 Board에 종속되고 DB cascade 대상이다.
- [x] 수정 PUT API에서 로그인과 작성자 ID를 확인하고 제목·본문·태그 변경을 원자적으로 저장한다.
- [x] Product 편집기의 presigned upload + SQS 처리 흐름을 참고해 Board 업로드 화면처럼 기존 이미지 유지, 최대 3장까지 추가, 썸네일별 개별 삭제를 구현한다.
- [x] 이미지 처리 SQS 접수 실패 시 새 이미지 참조를 제거하고 기존 텍스트/태그를 복구한다.
- [x] 활성 Board 설정 경로를 Product와 같은 ProductEditor/MediaCanvas/MetadataEditor 편집 모드로 전환하고, 작성자만 접근하게 한다. 레거시 비활성 설정 파일을 제거한다.
- [x] Product 판매 중단 상태 패턴을 참고해 Board 삭제 상태를 추가한다. API는 `DELETE_PENDING`으로 숨기고 SQS에 요청하며, S3 정리 성공 후 Lambda가 Board를 물리 삭제한다. 전송 실패와 DLQ 실패는 `DELETE_FAILED`로 보존한다.
- [x] StorageCleanupJob outbox를 Board 부분 이미지 제거와 업로드 임시 파일 정리에 사용한다. 전체 Board 삭제는 Board 자체의 `DELETE_PENDING`/`DELETE_FAILED` 상태로 관리하고 S3 삭제 성공 후 물리 삭제한다.
- [x] 변경 파일 정적 검토 및 범위 제한 검증. 테스트를 추가하거나 실행하지 않는다.

## 검증 결과

- `git diff --check` 통과.
- 변경 파일 ESLint 통과.
- `git diff --check` 통과.
- 전체 TypeScript 검사는 저장소의 기존 오류 때문에 실패했다. 변경한 Board API, ProductEditor 계열 컴포넌트, Board 화면으로 출력을 필터링했을 때 해당 파일의 진단은 없었다.
- Board 화면에서는 레거시 UploadImage 참조가 없고 Product 편집 성공 경로는 실제 productId를 사용한다.
- Stack Overflow의 답변 맥락 보존 제한과 Reddit의 작성자 게시물 삭제 지원을 비교해 Board는 댓글과 함께 삭제하는 물리 삭제로 결정했다. 삭제 확인창은 비가역성과 댓글 삭제를 알린다.
- 테스트 코드를 추가하거나 실행하지 않았다.

## 구현 메모

- User 탈퇴 정책은 별도 작업으로 남긴다.
- Lambda에서 `DELETE_ASSETS` 처리와 DLQ 호환 코드를 배포해야 S3 정리가 운영된다. Product 판매 중단은 S3 객체/Pro 버전을 삭제하지 않는다.
- Prisma migrations `20261117130000_storage_cleanup_jobs`와 `20261119120000_board_deletion_lifecycle`를 추가했다. 이후 사용자가 실패 시나리오에서 DB의 `DELETE_FAILED` 상태를 확인했으며, migration 적용 명령 자체는 이 작업공간에서 확인하지 않았다.
- AWS에 직접 적용할 Lambda 코드는 [lambda S3 cleanup integration](../../.superpowers/sdd/2026-11-17-board-edit-and-deletion-policy/lambda-s3-cleanup-patch.md)에 정리했다. 원본 Lambda는 `ReportBatchItemFailures`를 켜고, DLQ Lambda는 끈다. 자동 재전송 배치 스케줄은 현재 연결하지 않으며, 운영 중 자동 재시도가 필요해지면 별도로 결정한다.

## 운영 확인 업데이트

- 사용자가 실제 웹에서 Board 수정·삭제 정상 동작을 확인했다.
- 사용자가 삭제 실패 시나리오를 실행해 CloudWatch 오류 로그와 DB의 `DELETE_FAILED` 상태 기록을 확인했다.
- DLQ 트리거는 활성 상태로 유지하고 DLQ event source mapping의 `ReportBatchItemFailures`는 비활성화한다. DLQ Lambda가 처리 오류를 잡아 로그와 DB 상태를 남기고 정상 반환하면 해당 메시지는 재시도되지 않고 제거된다. 호출 자체의 timeout/crash는 별도로 재전달될 수 있다.
- `POST /api/cron/board-deletions`는 배포 후 필요할 때 개발자가 수동 호출해 오래된 `DELETE_PENDING`/`DELETE_FAILED`를 재전송한다. 현재 외부 스케줄러는 연결하지 않는다.

(function EarlyMasonryScript() {
  const MASONRY_CONTAINER_SELECTOR = '[data-masonry-container="true"]';
  const ITEM_SELECTOR = '[data-masonry-item="true"]';
  const GAP = 16; // 아이템 간격 (px)
  const MIN_CARD_WIDTH = 220; // 카드의 최소 너비 (px)

  const normalizeRatio = (ratio) => {
    if (ratio <= 1.0) return 1.0;
    else if (ratio >= 2.1) return 2.1;
    return ratio;
  };
  function calculateOptimalLayout(containerWidth) {
    if (!containerWidth || containerWidth <= 0) {
      return { columnWidth: MIN_CARD_WIDTH, columnCount: 1 };
    }

    // 1. 최소 너비 기준으로 가능한 최대 컬럼 수 계산
    const maxPossibleColumns = Math.max(
      1,
      Math.floor((containerWidth + GAP) / (MIN_CARD_WIDTH + GAP))
    );

    // 2. 해당 컬럼 수로 공간을 채웠을 때의 이상적인 너비 계산
    let idealWidth =
      (containerWidth - (maxPossibleColumns - 1) * GAP) / maxPossibleColumns;

    let columnCount = maxPossibleColumns;
    let columnWidth = idealWidth;

    // 3. 이상적인 너비가 최소 너비보다 작으면, 컬럼 수를 하나 줄이고 다시 계산
    if (idealWidth < MIN_CARD_WIDTH && maxPossibleColumns > 1) {
      columnCount = maxPossibleColumns - 1;
      columnWidth = (containerWidth - (columnCount - 1) * GAP) / columnCount;
      // 줄였음에도 최소 너비보다 작을 경우는 없어야 하지만, 안전 장치
      columnWidth = Math.max(MIN_CARD_WIDTH, columnWidth);
    }

    return { columnWidth: Math.floor(columnWidth), columnCount }; // 소수점 버림
  }

  function calculateAndApplyLayout() {
    try {
      const container = document.querySelector(MASONRY_CONTAINER_SELECTOR);
      if (!container) return;

      const items = Array.from(container.querySelectorAll(ITEM_SELECTOR));
      if (items.length === 0) return;

      const containerWidth = container.getBoundingClientRect().width;
      // 최적화된 레이아웃 파라미터 계산
      const { columnWidth, columnCount } =
        calculateOptimalLayout(containerWidth);

      const columnHeights = new Array(columnCount).fill(0);

      items.forEach((item) => {
        let shortestColumnIndex = 0;
        for (let i = 1; i < columnCount; i++) {
          if (columnHeights[i] < columnHeights[shortestColumnIndex]) {
            shortestColumnIndex = i;
          }
        }

        const top = columnHeights[shortestColumnIndex];
        const left = shortestColumnIndex * (columnWidth + GAP);
        const ratio = parseFloat(item.dataset.ratio) || 1.5;
        const itemHeight = columnWidth * normalizeRatio(ratio);

        columnHeights[shortestColumnIndex] += itemHeight + GAP;

        const style = `
          position: absolute !important;
          top: 0px; left: 0px;
          width: ${columnWidth}px !important; /* Apply dynamic width */
          height: ${itemHeight}px !important;
          transform: translateX(${left}px) translateY(${top}px);
          visibility: visible !important;
        `;
        item.style.cssText += style.replace(/\s+/g, ' ').trim();
      });

      const containerHeight = Math.max(...columnHeights) - GAP;
      container.style.height = `${containerHeight}px`;
    } catch (error) {
      console.error('EarlyMasonry Error:', error);
    }
  }

  // 초기 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculateAndApplyLayout, {
      once: true
    });
  } else {
    calculateAndApplyLayout();
  }
})();

import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (req: NextRequest, { params }) => {
  console.log(params, 'params');
  const body = await req.formData();
  const getFormData = (key: string[]) => {
    const data = [] as (FormDataEntryValue | null)[];
    key.forEach((v) => {
      data.push(body.get(v));
    });
    return data;
  };
  const keyArr = ['productAuth', 'title', 'hashtag', 'description', 'imageOk'];
  const test = getFormData(keyArr);
  console.log(test, 'test');
  return NextResponse.json({
    message: '???!!!'
  });
};

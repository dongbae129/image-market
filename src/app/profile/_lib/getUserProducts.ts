export const getUserProducts = async (userId, pageParam = 0): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/products?cursor=${pageParam}`,
      {
        next: {
          tags: ['userProducts', userId]
        }
      }
    );
    // const data = res.json();
    // data.then((v) => {
    //   console.log(v, 'VEVE');
    //   return v;
    // });
    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error('products server fail');
  }
};

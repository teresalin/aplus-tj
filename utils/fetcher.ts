// const fetcher = (url: string) => fetch(url).then((res) => res.json())

const fetcher = async (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    return res.json().then((error) => {
      throw new Error(error.message);
    });
  }
  return res.json()
});

export default fetcher;

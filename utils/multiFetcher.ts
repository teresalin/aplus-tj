const multiFetcher = (...urls) => {
  const f = (url) => fetch(url).then((r) => r.json());
  return Promise.all(urls.map((url) => f(url)));
};

export default multiFetcher;

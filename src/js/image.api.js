import { IMAGE_API } from './config';

export default {
  async getLinkToImage() {
    const url = `https://api.unsplash.com/photos/random?query=morning&client_id=${IMAGE_API}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.urls.regular);
  },
};

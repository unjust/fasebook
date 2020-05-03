const axios = jest.genMockFromModule('axios');

axios.get = jest.fn(() => new Promise(() => {}));
axios.post = jest.fn(() => new Promise(() => {}));
axios.create = jest.fn(() => axios);

export default axios;

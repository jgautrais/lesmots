import { instance } from '../instance';

const FetchOneByDate = async (date: string) =>
    instance.get(`api/wordsPool/${date}`).json();

export default FetchOneByDate
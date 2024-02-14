import { useQuery } from '@tanstack/react-query';
import { fetchOneByDate } from '@/utils/wordsPool/fetchOneByDate';

function App() {
  const day = '2024-02-10';

  const { data } = useQuery({
    queryKey: ['wordsPoolOfDay', day],
    queryFn: () => fetchOneByDate(day),
  });

  return (
    <div className="h-screen bg-gray-50 bg-opacity-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center py-8">Les Mots</h1>
        <p className="read-the-docs">{JSON.stringify(data, null, 2)}</p>
      </div>
      <br />
    </div>
  );
}

export default App;

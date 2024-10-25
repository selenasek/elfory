import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { GameBoard } from './components/GameBoard';
import { getElfs, getToys } from './sanity';

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}><SanityLoader /></QueryClientProvider>;
}

function SanityLoader() {

  const { data: toys } = useQuery({
    queryKey: ['toys'],
    queryFn: async () => {
      return getToys();
    }
  })

  const { data: elfs } = useQuery({
    queryKey: ['elfs'],
    queryFn: async () => {
      return getElfs();
    }
  })

  console.log(toys, elfs)

  if (toys === undefined || elfs === undefined) {
    return <></>
  }

  return <GameBoard toys={toys} elfs={elfs} />
}

export default App;
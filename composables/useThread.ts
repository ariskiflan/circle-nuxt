import { getThreads } from "~/services/thread"

// composables/useThreads.ts
export const useThreads = () => {
//   const threads = useState<Ithread[]>('threads', () => [])

 const { data: threads, refresh: refreshThread } = 
    useAsyncData('threads-key', () => getThreads())

  return {
    threads,
    refreshThread
  }
}
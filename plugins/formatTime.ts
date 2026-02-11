// plugins/format-time.ts
export default defineNuxtPlugin(() => {
  const timeAgo = (dateString: string | Date) => {
    if (!dateString) return "";
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} tahun lalu`;
    if (months > 0) return `${months} bulan lalu`;
    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    if (seconds <= 0) return `baru saja`;
    return `${seconds} detik lalu`;
  };

  return {
    provide: {
      // Ini akan membuat fungsi bisa dipanggil dengan $timeAgo
      timeAgo
    }
  }
})

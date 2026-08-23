export const api = {
  igot: {
    getConfig: async () => {
      const res = await fetch('/api/igot/config');
      return res.json();
    },
    getDashboard: async () => {
      const res = await fetch('/api/igot/dashboard');
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    getLogs: async () => {
      const res = await fetch('/api/igot/logs');
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    getLearnerProfile: async (id: string) => {
      const res = await fetch(`/api/igot/users/${id}/profile`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    getCatalogue: async () => {
      const res = await fetch('/api/igot/courses/catalogue');
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    getRecommendations: async (competency: string) => {
      const res = await fetch(`/api/igot/courses/recommend?competency=${encodeURIComponent(competency)}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
  }
};

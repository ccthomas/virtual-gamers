// src/context/TeamContext.tsx

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { Team } from '../types/Team';
import { apiGet } from '../utils/apiUtil';
import { RUBY_SERVICE_API } from '../constants';

interface TeamContextType {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiGet(`${RUBY_SERVICE_API}/college_football/teams`);
        setTeams(response.data.data);
      } catch (err) {
        setError('Error fetching teams data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <TeamContext.Provider value={{ teams, loading, error }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};

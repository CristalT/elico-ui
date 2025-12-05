'use client';
import api from '@/lib/api';
import { SettingsType } from '@/lib/api/types';
import { useQuery } from '@tanstack/react-query';
import { useContext, createContext } from 'react';

interface SettingsContextType {
    settings?: SettingsType;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: () => api.setting.getAll(),
    });

    return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

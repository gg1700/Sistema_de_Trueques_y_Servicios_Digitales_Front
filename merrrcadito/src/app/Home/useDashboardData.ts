// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { EventService } from '@/services/eventService';
import { ExchangeService } from '@/services/exchangeService';
import { getAllTokenPackages } from '@/services/tokenService';

// Helper function to get random elements
const getRandomElements = <T,>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
};

const MAX_RANDOM_ITEMS = 12;

// Hook for exchanges
export const useExchanges = () => {
    const [exchanges, setExchanges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadExchanges() {
            try {
                const response = await ExchangeService.get_all_exchanges();
                if (response.success && response.data) {
                    const randomExchanges = getRandomElements(response.data, MAX_RANDOM_ITEMS);
                    setExchanges(randomExchanges);
                }
            } catch (err) {
                console.error('Error loading exchanges:', err);
            } finally {
                setLoading(false);
            }
        }
        loadExchanges();
    }, []);

    return { exchanges, loading };
};

// Hook for events
export const useEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const response = await EventService.get_all_events();
                if (response.success && response.data) {
                    const randomEvents = getRandomElements(response.data, MAX_RANDOM_ITEMS);
                    setEvents(randomEvents);
                }
            } catch (err) {
                console.error('Error loading events:', err);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    return { events, loading };
};

// Hook for promotions
export const usePromotions = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPromotions() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/active`);
                const data = await response.json();
                if (data.success && data.data) {
                    const randomPromotions = getRandomElements(data.data, MAX_RANDOM_ITEMS);
                    setPromotions(randomPromotions);
                }
            } catch (err) {
                console.error('Error loading promotions:', err);
            } finally {
                setLoading(false);
            }
        }
        loadPromotions();
    }, []);

    return { promotions, loading };
};

// Hook for token packages
export const useTokenPackages = () => {
    const [tokenPackages, setTokenPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTokenPackages() {
            try {
                const data = await getAllTokenPackages();
                if (data && data.length > 0) {
                    const randomPackages = getRandomElements(data, MAX_RANDOM_ITEMS);
                    setTokenPackages(randomPackages);
                }
            } catch (err) {
                console.error('Error loading token packages:', err);
            } finally {
                setLoading(false);
            }
        }
        loadTokenPackages();
    }, []);

    return { tokenPackages, loading };
};

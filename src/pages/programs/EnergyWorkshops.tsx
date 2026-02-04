
import React, { useEffect, useState } from 'react';
import ProgramGalleryLayout from '../../components/programs/ProgramGalleryLayout';
import { getProgramsFn } from '../../api/programs.api';
import type { Program } from '../../types/program.types';

// Assets
import workshop1 from '../../assets/energy _workshop.jpeg';
import workshop2 from '../../assets/energyworkshop1.jpeg';

const EnergyWorkshops: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    const placeholderImages = [workshop1, workshop2];

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await getProgramsFn('ENERGY_WORKSHOPS');
                if (Array.isArray(data)) {
                    setPrograms(data);
                } else if (data) {
                    setPrograms([data as Program]);
                }
            } catch (error) {
                console.error("Failed to fetch program data", error);
                // Fallback content if API fails
                setPrograms([{
                    id: 0,
                    title: "Energy Workshops",
                    description: "Experience the power of life force energy. Join our workshops to learn ancient techniques for healing, balance, and inner transformation. (Offline mode)",
                    imageUrl: ""
                }]);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <ProgramGalleryLayout
            label="Explore Our Programs"
            pageTitle="Energy Workshops"
            programs={programs}
            defaultImages={placeholderImages}
            isLoading={loading}
        />
    );
};

export default EnergyWorkshops;

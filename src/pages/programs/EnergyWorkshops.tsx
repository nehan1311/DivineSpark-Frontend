
import React, { useEffect, useState } from 'react';
import ProgramGalleryLayout from '../../components/programs/ProgramGalleryLayout';
import { getProgramsFn } from '../../api/programs.api';
import type { Program } from '../../types/program.types';

// Placeholder Images
import slide1 from '../../assets/slide-1.png';
import slide2 from '../../assets/slide-2.png';
import slide3 from '../../assets/slide-3.png';

const EnergyWorkshops: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    const placeholderImages = [slide1, slide2, slide3];

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

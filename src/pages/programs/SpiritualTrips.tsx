
import React, { useEffect, useState } from 'react';
import ProgramGalleryLayout from '../../components/programs/ProgramGalleryLayout';
import { getProgramsFn } from '../../api/programs.api';
import type { Program } from '../../types/program.types';

// Placeholder Images
import slide4 from '../../assets/slide-4.png';
import slide5 from '../../assets/slide-5.png';
import slide6 from '../../assets/slide-6.png';

const SpiritualTrips: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    const placeholderImages = [slide4, slide5, slide6];

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await getProgramsFn('SPIRITUAL_TRIPS');
                if (Array.isArray(data)) {
                    setPrograms(data);
                } else if (data) {
                    setPrograms([data as Program]);
                }
            } catch (error) {
                console.error("Failed to fetch program data", error);
                setPrograms([{
                    id: 0,
                    title: "Spiritual Trips",
                    description: "Embark on a sacred journey to powerful energy vortexes. Reconnect with nature and find deep inner peace through our guided spiritual excursions. (Offline mode)",
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
            pageTitle="Spiritual Trips"
            programs={programs}
            defaultImages={placeholderImages}
            isLoading={loading}
        />
    );
};

export default SpiritualTrips;

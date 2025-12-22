import React from 'react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';

const Sessions: React.FC = () => {
    return (
        <Section>
            <h1>Available Sessions</h1>
            <p style={{ maxWidth: '600px', margin: '1rem 0 3rem', color: 'var(--color-text-secondary)' }}>
                Browse our range of therapeutic sessions designed for your wellbeing.
            </p>

            <div className="grid-cols-2">
                {/* Placeholder Session Cards */}
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} style={{
                        background: 'var(--color-bg-surface)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ height: '200px', background: '#e0e0e0', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}></div>
                        <h3>Session Title {item}</h3>
                        <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--color-text-secondary)' }}>
                            Brief description of the session goes here. Relaxing and restorative.
                        </p>
                        <div className="flex-between">
                            <span style={{ fontWeight: 600 }}>$60 / 1h</span>
                            <Button size="sm">Book</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Sessions;

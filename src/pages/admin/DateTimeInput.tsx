import React from 'react';

interface DateTimeInputProps {
    name: string;
    value: string; // ISO format YYYY-MM-DDTHH:mm
    onChange: (e: { target: { name: string; value: string } }) => void;
    min?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    styles: any;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ name, value, onChange, min, label, error, disabled, styles }) => {
    // Parse value
    const datePart = value ? value.split('T')[0] : '';
    const timePart = value ? value.split('T')[1] : '';

    // Initialize defaults if parsing fails or empty
    let hour = '12';
    let minute = '00';
    let period = 'AM';

    if (timePart) {
        const [hStr, mStr] = timePart.split(':');
        const h = parseInt(hStr, 10);
        if (!isNaN(h)) {
            if (h === 0) { hour = '12'; period = 'AM'; }
            else if (h === 12) { hour = '12'; period = 'PM'; }
            else if (h > 12) { hour = (h - 12).toString(); period = 'PM'; }
            else { hour = h.toString(); period = 'AM'; }
        }
        // Allow empty string to pass through for editing
        if (mStr !== undefined) minute = mStr;
    }

    const handlePartChange = (type: 'date' | 'hour' | 'minute' | 'period', newVal: string) => {
        let newDate = type === 'date' ? newVal : datePart;
        let newHour = type === 'hour' ? newVal : hour;
        let newMinute = type === 'minute' ? newVal : minute;
        let newPeriod = type === 'period' ? newVal : period;

        // If user clears date, we just send empty string
        if (!newDate) {
            onChange({ target: { name, value: '' } });
            return;
        }

        let h = parseInt(newHour, 10);
        if (newPeriod === 'PM' && h < 12) h += 12;
        if (newPeriod === 'AM' && h === 12) h = 0;

        const hStr = h.toString().padStart(2, '0');
        // Do not pad minutes immediately to allow typing
        const mStr = newMinute;

        const isoValue = `${newDate}T${hStr}:${mStr}`;

        onChange({
            target: {
                name: name,
                value: isoValue
            }
        });
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{label}</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                    type="date"
                    value={datePart}
                    min={min ? min.split('T')[0] : undefined}
                    onChange={(e) => handlePartChange('date', e.target.value)}
                    className={styles.input}
                    disabled={disabled}
                    required
                    style={{ flex: '2 1 150px' }}
                />
                <div style={{ display: 'flex', gap: '0.25rem', flex: '1 1 180px', alignItems: 'center' }}>
                    <select
                        value={hour}
                        onChange={(e) => handlePartChange('hour', e.target.value)}
                        className={styles.input}
                        disabled={disabled}
                        style={{ flex: 1, paddingLeft: '0.2rem', paddingRight: '0.2rem', textAlign: 'center' }}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                    <span style={{ fontWeight: 'bold', color: '#666' }}>:</span>
                    <input
                        type="text"
                        value={minute}
                        onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            // If user is adding digits, we might want to slice only if it's strictly > 2
                            // But better to just let them type and handle validation on blur or simple slice
                            if (val.length > 2) val = val.slice(0, 2);
                            handlePartChange('minute', val);
                        }}
                        onBlur={(e) => {
                            let val = e.target.value;
                            const intVal = parseInt(val, 10);
                            if (isNaN(intVal)) val = '00';
                            else if (intVal > 59) val = '59';
                            else if (intVal < 0) val = '00';
                            else val = intVal.toString().padStart(2, '0');
                            handlePartChange('minute', val);
                        }}
                        className={styles.input}
                        disabled={disabled}
                        style={{ flex: 1, textAlign: 'center', paddingLeft: '0.2rem', paddingRight: '0.2rem' }}
                        placeholder="MM"
                    />
                    <select
                        value={period}
                        onChange={(e) => handlePartChange('period', e.target.value)}
                        className={styles.input}
                        disabled={disabled}
                        style={{ flex: 1, paddingLeft: '0.2rem', paddingRight: '0.2rem', textAlign: 'center' }}
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default DateTimeInput;

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
            <label className={styles.formLabel}>{label}</label>
            <div className={styles.dateTimeContainer}>
                {/* Date Part - Using Standard Input Style */}
                <input
                    type="date"
                    value={datePart}
                    min={min ? min.split('T')[0] : undefined}
                    onChange={(e) => handlePartChange('date', e.target.value)}
                    className={styles.formInput}
                    disabled={disabled}
                    required
                    style={{ flex: '2', minWidth: '140px' }}
                />

                {/* Time Segment - Custom Styled Grouper */}
                <div className={styles.dateTimeSegment} style={{ flex: '1' }}>
                    <select
                        value={hour}
                        onChange={(e) => handlePartChange('hour', e.target.value)}
                        className={styles.timeInput}
                        disabled={disabled}
                        style={{ width: 'auto', minWidth: '40px' }}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                    <span className={styles.timeSeparator}>:</span>
                    <input
                        type="text"
                        value={minute}
                        onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
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
                        className={styles.timeInput}
                        disabled={disabled}
                        placeholder="MM"
                        pattern="[0-5][0-9]"
                        title="Minutes (00-59)"
                    />
                    <select
                        value={period}
                        onChange={(e) => handlePartChange('period', e.target.value)}
                        className={styles.periodSelect}
                        disabled={disabled}
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

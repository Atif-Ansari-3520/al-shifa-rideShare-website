import { useEffect, useRef, useState } from 'react';

export const useCountUp = (end: number, duration: number = 1000): number => {
    const [count, setCount] = useState(0);
    const startValue = useRef(0);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startValue.current) { // Changed from startTime.current
                startValue.current = timestamp; // Changed from startTime.current
            }

            const progress = timestamp - startValue.current; // Changed from startTime.current
            const percentage = Math.min(progress / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCount(Math.floor(end * easeOut));

            if (percentage < 1) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [end, duration]);

    return count;
}

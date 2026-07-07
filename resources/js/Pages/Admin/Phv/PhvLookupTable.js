export const phvLookupData = [
  { years: -3, early: 39.69, average: 35.04, late: 30.27 },
  { years: -2.9, early: 39.1, average: 34.544, late: 29.83 },
  { years: -2.8, early: 38.51, average: 34.048, late: 29.39 },
  { years: -2.7, early: 37.92, average: 33.552, late: 28.95 },
  { years: -2.6, early: 37.33, average: 33.056, late: 28.51 },
  { years: -2.5, early: 36.74, average: 32.56, late: 28.07 },
  { years: -2.4, early: 36.15, average: 32.064, late: 27.63 },
  { years: -2.3, early: 35.56, average: 31.559, late: 27.157 },
  { years: -2.2, early: 34.97, average: 31.054, late: 26.684 },
  { years: -2.1, early: 34.38, average: 30.549, late: 26.211 },
  { years: -2, early: 33.79, average: 30.044, late: 25.738 },
  { years: -1.9, early: 33.2, average: 29.539, late: 25.265 },
  { years: -1.8, early: 32.61, average: 29.034, late: 24.792 },
  { years: -1.7, early: 32, average: 28.468, late: 24.235 },
  { years: -1.6, early: 31.39, average: 27.902, late: 23.678 },
  { years: -1.5, early: 30.784, average: 27.336, late: 23.121 },
  { years: -1.4, early: 30.178, average: 26.77, late: 22.564 },
  { years: -1.3, early: 29.572, average: 26.204, late: 22.007 },
  { years: -1.2, early: 28.966, average: 25.638, late: 21.45 },
  { years: -1.1, early: 28.25, average: 24.951, late: 20.822 },
  { years: -1, early: 27.534, average: 24.264, late: 20.194 },
  { years: -0.9, early: 26.818, average: 23.577, late: 19.566 },
  { years: -0.8, early: 26.102, average: 22.89, late: 18.938 },
  { years: -0.7, early: 25.386, average: 22.203, late: 18.31 },
  { years: -0.6, early: 24.67, average: 21.516, late: 17.682 },
  { years: -0.5, early: 23.73, average: 20.624, late: 16.91 },
  { years: -0.4, early: 22.79, average: 19.732, late: 16.138 },
  { years: -0.3, early: 21.85, average: 18.84, late: 15.366 },
  { years: -0.2, early: 20.91, average: 17.948, late: 14.594 },
  { years: -0.1, early: 19.97, average: 17.056, late: 13.822 },
  { years: 0, early: 18.965, average: 16.164, late: 13.05 },
  { years: 0.1, early: 17.96, average: 15.246, late: 12.253 },
  { years: 0.2, early: 16.955, average: 14.328, late: 11.456 },
  { years: 0.3, early: 15.95, average: 13.41, late: 10.659 },
  { years: 0.4, early: 14.945, average: 12.492, late: 9.862 },
  { years: 0.5, early: 13.94, average: 11.574, late: 9.065 },
  { years: 0.6, early: 12.935, average: 10.656, late: 8.268 },
  { years: 0.7, early: 12.155, average: 9.979, late: 7.646 },
  { years: 0.8, early: 11.375, average: 9.302, late: 7.024 },
  { years: 0.9, early: 10.595, average: 8.625, late: 6.402 },
  { years: 1, early: 9.815, average: 7.948, late: 5.78 },
  { years: 1.1, early: 9.035, average: 7.271, late: 5.158 },
  { years: 1.2, early: 8.255, average: 6.594, late: 4.536 },
  { years: 1.3, early: 7.725, average: 6.129, late: 4.099 },
  { years: 1.4, early: 7.195, average: 5.664, late: 3.662 },
  { years: 1.5, early: 6.665, average: 5.199, late: 3.225 },
  { years: 1.6, early: 6.135, average: 4.734, late: 2.788 },
  { years: 1.7, early: 5.605, average: 4.269, late: 2.351 },
  { years: 1.8, early: 5.075, average: 3.804, late: 1.914 },
  { years: 1.9, early: 4.705, average: 3.497, late: 1.691 },
  { years: 2, early: 4.335, average: 3.19, late: 1.468 },
  { years: 2.1, early: 3.965, average: 2.883, late: 1.245 },
  { years: 2.2, early: 3.595, average: 2.576, late: 1.022 },
  { years: 2.3, early: 3.225, average: 2.269, late: 0.799 },
  { years: 2.4, early: 2.855, average: 1.962, late: 0.576 },
  { years: 2.5, early: 2.605, average: 1.78, late: 0.48 },
  { years: 2.6, early: 2.355, average: 1.598, late: 0.384 },
  { years: 2.7, early: 2.105, average: 1.416, late: 0.288 },
  { years: 2.8, early: 1.855, average: 1.234, late: 0.192 },
  { years: 2.9, early: 1.605, average: 1.052, late: 0.096 },
  { years: 3, early: 1.355, average: 0.87, late: 0 }
];

export const getRemainingGrowth = (maturityOffset, maturityStatus) => {
    if (maturityOffset < -3) maturityOffset = -3;
    if (maturityOffset > 3) maturityOffset = 3;

    const roundedOffset = Math.round(maturityOffset * 10) / 10;
    
    let closestRow = phvLookupData[0];
    let minDiff = Infinity;
    
    for (const row of phvLookupData) {
        const diff = Math.abs(row.years - roundedOffset);
        if (diff < minDiff) {
            minDiff = diff;
            closestRow = row;
        }
    }
    
    if (maturityStatus === 'Early') return closestRow.early;
    if (maturityStatus === 'Late') return closestRow.late;
    return closestRow.average; 
};

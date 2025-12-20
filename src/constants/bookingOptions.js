

export const frequencyOptions = [
    { code: 'Once', label: 'One Time' },
    { code: 'Weekly', label: 'Weekly (15% Off)' },
    { code: 'Bi-weekly', label: 'Bi-weekly (10% Off)' },
    { code: 'Monthly', label: 'Monthly (5% Off)' },
];

export const extraOptions = [
    { code: 'Windows', name: 'Interior Windows', description: 'Cleaning interior glass surfaces.', price: 1500 },
    { code: 'Oven', name: 'Oven Cleaning', description: 'Deep cleaning of the oven interior.', price: 2000 },
    { code: 'Fridge', name: 'Refrigerator Cleaning', description: 'Empty and wipe down the interior.', price: 1500 },
    { code: 'Laundry', name: 'Laundry Service', description: 'Wash and fold up to two loads.', price: 1000 },
];

export const propertyOptions = {
    minBeds: 1,
    maxBeds: 5,
    minBaths: 1,
    maxBaths: 4,
};

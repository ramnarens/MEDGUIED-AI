export const mockPatient = {
  id: 'p1',
  name: 'Martha Stewart',
  age: 72,
  language: 'English',
  avatar: 'https://i.pravatar.cc/150?img=47',
  emergencyContact: {
    name: 'John Stewart',
    relation: 'Son',
    phone: '+1 555-0198'
  }
};

export const mockMedicines = [
  {
    id: 'm1',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    dosage: '500mg',
    purpose: 'Type 2 Diabetes',
    instructions: 'Take one tablet after breakfast and dinner',
    timing: ['Morning', 'Night'],
    food: 'After food',
    photo: 'https://images.unsplash.com/photo-1584308666744-24d5e4785b27?auto=format&fit=crop&w=300&q=80',
    streak: 14,
    sideEffects: ['Nausea', 'Upset stomach'],
    warnings: ['Do not skip meals', 'Avoid excessive alcohol']
  },
  {
    id: 'm2',
    genericName: 'Lisinopril',
    brandName: 'Prinivil',
    dosage: '10mg',
    purpose: 'Blood Pressure',
    instructions: 'Take one tablet in the morning',
    timing: ['Morning'],
    food: 'Before food',
    photo: 'https://images.unsplash.com/photo-1550572017-edb9c467df88?auto=format&fit=crop&w=300&q=80',
    streak: 30,
    sideEffects: ['Dry cough', 'Dizziness'],
    warnings: ['Drink plenty of water']
  },
  {
    id: 'm3',
    genericName: 'Atorvastatin',
    brandName: 'Lipitor',
    dosage: '20mg',
    purpose: 'Cholesterol',
    instructions: 'Take one tablet at night',
    timing: ['Night'],
    food: 'Independent',
    photo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80',
    streak: 7,
    sideEffects: ['Muscle ache'],
    warnings: ['Avoid grapefruit juice']
  }
];

export const mockSchedule = {
  'Morning': [
    { medicineId: 'm1', taken: true, time: '08:00 AM' },
    { medicineId: 'm2', taken: false, time: '09:00 AM' }
  ],
  'Afternoon': [],
  'Night': [
    { medicineId: 'm1', taken: false, time: '08:00 PM' },
    { medicineId: 'm3', taken: false, time: '09:30 PM' }
  ]
};

export const mockCaregiverStats = {
  adherenceRate: 92,
  missedDoses: 1,
  upcomingRefills: 2
};

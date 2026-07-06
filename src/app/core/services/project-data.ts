export interface Project {
  id: number;
  name: string;
  type: string;
  department: string;
  startDate: string;
}

export const projectData = {
  projects: [
    {
      id: 1,
      name: 'Population Census',
      type: 'Census',
      department: 'Revenue',
      startDate: '2026-08-01'
    },
    {
      id: 2,
      name: 'Drug Survey',
      type: 'Survey',
      department: 'Health',
      startDate: '2026-08-15'
    }
  ]
};
export interface Project {

  id: number;
  name: string;
  type: string;
  department: string;
  startDate: string;
  officerId: number;

}

export const projectData = {

  projects: [

    {
      id: 1,
      name: 'Election',
      type: 'Election',
      department: 'Election',
      startDate: '2026-07-01',
      officerId: 1
    },

    {
      id: 2,
      name: 'Population Census',
      type: 'Census',
      department: 'Revenue',
      startDate: '2026-08-01',
      officerId: 2
    },

    {
      id: 3,
      name: 'Drug Survey',
      type: 'Survey',
      department: 'Health',
      startDate: '2026-08-15',
      officerId: 1
    }

  ]

};
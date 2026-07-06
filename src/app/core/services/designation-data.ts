export interface Designation {
  id: number;
  role: string;
  description: string;
}

export const designationData = {
  designations: [
    {
      id: 1,
      role: 'Enumerator',
      description: 'Collects survey and census data.'
    },
    {
      id: 2,
      role: 'Supervisor',
      description: 'Supervises field staff.'
    },
    {
      id: 3,
      role: 'Nodal Officer',
      description: 'Coordinates the complete project.'
    }
  ]
};
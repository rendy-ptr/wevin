import { templateRepository } from '@/repositories/template.repository';

export const templateService = {
  getAll: async () => {
    return await templateRepository.getAll();
  },

  getById: async (id: number) => {
    return await templateRepository.getById(id);
  },
};

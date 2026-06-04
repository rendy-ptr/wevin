import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { BasePackageBenefitModel } from '@/types/benefit.type';
import {
  BasePackageModel,
  PackageFilterParams,
  PackageIndexItem,
  PackageWithRelationships,
} from '@/types/package.type';
import {
  BasePackageTemplateModel,
  BaseTemplateModel,
} from '@/types/template.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

export const useGetPackages = ({
  search,
  isActive,
  isPopular,
  page = 1,
  limit = 10,
}: PackageFilterParams): UseQueryResult<{
  items: PackageIndexItem[];
  total: number;
}> => {
  return useQuery({
    queryKey: ['packages', search, isActive, isPopular, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.PACKAGE.GET, {
        params: { search, isActive, isPopular, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as {
        items: PackageIndexItem[];
        total: number;
      };
    },
  });
};

export const useGetPackageById = (
  id: number,
): UseQueryResult<PackageWithRelationships> => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const response = await api.get(API_URL.PACKAGE.GET_BY_ID(id));
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as PackageWithRelationships;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreatePackage = (): UseMutationResult<
  BasePackageModel,
  Error,
  CreateUpdatePackageFormValues
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdatePackageFormValues) => {
      const response = await api.post(API_URL.PACKAGE.CREATE, data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal membuat paket');
      }
      return response.data.data as BasePackageModel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};

export const useUpdatePackage = (): UseMutationResult<
  BasePackageModel,
  Error,
  CreateUpdatePackageFormValues & { id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateUpdatePackageFormValues & { id: number }) => {
      const response = await api.put(API_URL.PACKAGE.UPDATE(id), data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal memperbarui paket');
      }
      return response.data.data as BasePackageModel;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['package', variables.id] });
    },
  });
};

export const useDeletePackage = (): UseMutationResult<
  BasePackageModel,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.PACKAGE.DELETE(id));
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal menghapus paket');
      }
      return response.data.data as BasePackageModel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};

export const useGetActivePackages = (): UseQueryResult<
  (Pick<BasePackageModel, 'id' | 'name' | 'price'> & {
    benefits: Pick<
      BasePackageBenefitModel,
      'id' | 'benefitKey' | 'toggleValue' | 'quotaValue'
    >[];
    templates: (BasePackageTemplateModel & {
      template: Pick<BaseTemplateModel, 'id' | 'name'>;
    })[];
  })[]
> => {
  return useQuery({
    queryKey: ['packages', 'active'],
    queryFn: async () => {
      const response = await api.get(API_URL.PACKAGE.GET_ACTIVE);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as (Pick<
        BasePackageModel,
        'id' | 'name' | 'price'
      > & {
        benefits: Pick<
          BasePackageBenefitModel,
          'id' | 'benefitKey' | 'toggleValue' | 'quotaValue'
        >[];
        templates: (BasePackageTemplateModel & {
          template: Pick<BaseTemplateModel, 'id' | 'name'>;
        })[];
      })[];
    },
  });
};

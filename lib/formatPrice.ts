export const formatPrice = (value: string | number): string => {
    if (!value) return '';
    const numericValue = typeof value === 'string' ? value : value.toString();
    const cleanValue = numericValue.replace(/\D/g, '');
    if (!cleanValue) return '';

    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

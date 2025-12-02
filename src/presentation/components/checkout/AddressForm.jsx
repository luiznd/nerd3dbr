import { useForm } from 'react-hook-form';
import AddressFields from '../ui/AddressFields'; // Importando o novo componente

const AddressForm = ({ initialAddress, onAddressChange, onShippingMethodChange, selectedMethod }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialAddress || {}
  });

  // A lógica de busca de CEP e os campos de endereço agora estão no AddressFields
  // Apenas a lógica de frete permanece aqui

  // Atualiza o endereço quando o formulário muda
  const onSubmit = (data) => {
    onAddressChange(data);
  };

  // Opções de frete
  const shippingOptions = [
    { id: 'economic', name: 'Econômico', price: 15.90, days: '5-8 dias úteis' },
    { id: 'standard', name: 'Padrão', price: 25.90, days: '3-5 dias úteis' },
    { id: 'express', name: 'Expresso', price: 45.90, days: '1-2 dias úteis' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Endereço de Entrega</h2>
      
      <form onChange={handleSubmit(onSubmit)} className="space-y-4">
        {/* Componente de campos de endereço reutilizável */}
        <AddressFields 
          register={register} 
          errors={errors} 
          setValue={setValue} 
          watch={watch} 
        />
      </form>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Método de Envio</h2>
        
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <div 
              key={option.id}
              className={`border rounded-md p-4 cursor-pointer ${selectedMethod === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => onShippingMethodChange(option.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border ${selectedMethod === option.id ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                    {selectedMethod === option.id && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-500">{option.days}</p>
                  </div>
                </div>
                <span className="font-semibold">R$ {option.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;

namespace EvaluationProject.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Manufacturer, ManufacturerDTO>().ReverseMap();
            CreateMap<ManufacturerCreationDTO, Manufacturer>();
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<ProductCreationDTO, Product>();
            CreateMap<Rate, RateDTO>()
                .ForMember(destination => destination.ProductName, opt => opt
                .MapFrom(src => src.Product.Name))
                .ReverseMap(); ;
            CreateMap<RateCreationDTO, Rate>();
            CreateMap<PurchaseHistory, PurchaseHistoryDTO>()
                .ForMember(destination => destination.ManufacturerName, opt => opt
                .MapFrom(src => src.Manufacturer.Name))
                .ForMember(destination => destination.ProductName, opt => opt
                .MapFrom(src => src.Product.Name))
                .ForMember(destination => destination.RateAmount, opt => opt
                .MapFrom(src => src.Rate.Amount))
                .ReverseMap();
            CreateMap<PurchaseHistoryCreationDTO, PurchaseHistory>();
            CreateMap<PurchaseHistory,PurchaseHistoryListDTO>().ForMember(destination => destination.ManufacturerName, opt => opt
                .MapFrom(src => src.Manufacturer.Name)).ReverseMap();
            CreateMap<ManufacturerProductMapping, MappingDTO>()
                .ForMember(destination => destination.ManufacturerName, opt => opt
                .MapFrom(src => src.Manufacturer.Name))
                .ForMember(destination => destination.ProductName, opt => opt
                .MapFrom(src => src.Product.Name))
                .ReverseMap();
            CreateMap<MappingCreationDTO, ManufacturerProductMapping>();
            CreateMap<PurchaseHistory, InvoiceIdDTO>().ReverseMap();
        }

    }
}

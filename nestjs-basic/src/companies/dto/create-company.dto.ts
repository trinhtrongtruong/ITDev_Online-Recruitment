import { IsNotEmpty } from 'class-validator';
//Data Tranfer Object (DTO) // class{}
export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;
    
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Logo không được để trống' })
    logo: string;
}

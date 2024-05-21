import { IsBoolean, IsNotEmpty } from 'class-validator';
//Data Tranfer Object (DTO) // class{}
export class CreatePostDto {
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;
    
    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    content: string;

    @IsNotEmpty({ message: 'Hình ảnh không được để trống' })
    image: string;

    // @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    // @IsBoolean({ message: "isActive phải có định dạng Boolean"})
    // isActive: boolean;
}

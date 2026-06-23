import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');

    // 🔥 debug importante (dejalo hasta terminar el TP)
    console.log('CLOUDINARY INIT:', {
      cloudName,
      apiKey,
      apiSecret: apiSecret ? 'OK' : 'MISSING',
    });

    // 🚨 validación simple (evita errores silenciosos)
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary env variables missing');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    return cloudinary;
  },
};

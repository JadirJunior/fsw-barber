/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "utfs.io", //Configurando o host da imagem
        }]
    }
};

export default nextConfig;
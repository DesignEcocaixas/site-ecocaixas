module.exports = function renderLogin(error = false) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login | EcoAdmin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = { theme: { extend: { colors: { brand: '#029723', brandDark: '#015e15', brandLight: '#e6f5e9', darkBg: '#0a1910' }, fontFamily: { sans: ['Inter', 'sans-serif'], } } } }
        </script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }</style>
    </head>
    <body class="text-gray-800 antialiased selection:bg-brand selection:text-white flex flex-col min-h-screen items-center justify-center relative overflow-hidden">

        <div class="absolute inset-0 z-0 opacity-20">
            <div class="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80')] bg-cover bg-center grayscale"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f1f5f9] via-[#f1f5f9]/80 to-gray-200"></div>
        </div>

        <div class="w-full max-w-md p-8 md:p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 relative z-10 mx-4">
            <div class="text-center mb-8">
                <img src="/logo.png" alt="Logo Ecocaixas" class="h-16 w-auto mx-auto mb-4">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Acesso Restrito</h2>
                <p class="text-gray-500 text-sm mt-2 font-medium">Painel Administrativo Ecocaixas</p>
            </div>

            ${error ? `<div class="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center border border-red-100 animate-pulse"><i class="fa-solid fa-circle-exclamation mr-2"></i> Token inválido. Tente novamente.</div>` : ''}

            <form action="/login" method="POST">
                <div class="mb-6">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Token de Acesso</label>
                    <input type="password" name="token" class="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all font-medium text-center text-lg tracking-widest" required placeholder="••••••••••••">
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-brand transition-colors shadow-lg text-lg flex justify-center items-center">
                    <i class="fa-solid fa-right-to-bracket mr-2"></i> Entrar no Sistema
                </button>
            </form>
            
            <div class="mt-8 text-center border-t border-gray-100 pt-6">
                <a href="/" class="text-gray-400 hover:text-brand text-sm font-bold transition-colors"><i class="fa-solid fa-arrow-left mr-1"></i> Voltar ao site público</a>
            </div>
        </div>

    </body>
    </html>
    `;
};
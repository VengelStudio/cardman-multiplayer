module.exports = {
    apps: [
        {
            name: 'hangman-server',
            script: './src/Server/index.js',
            ignore_watch: [
                './src/Server/logs',
                '.vscode',
                '.git',
                'node_modules'
            ],
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
            watch: true,
            windowsHide: false,
            force: true,
            error_file: './src/Server/logs/err.log',
            out_file: './src/Server/logs/out.log'
        }
    ]
}

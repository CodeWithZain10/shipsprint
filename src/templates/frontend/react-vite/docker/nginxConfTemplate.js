const reactNginxConfTemplate = () => {
    return `server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # API and system routes are served by the backend container
    location ~ ^/(api/|health$|version$|api-info$) {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Single-page app fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
`
}

export default reactNginxConfTemplate;

# Local Development Setup - neuros.local

This guide helps you set up `neuros.local` as your local development domain.

## Quick Setup (Port 80 - Clean URLs)

### Option 1: Using Proxy (Recommended)
1. **Add to hosts file** (one-time setup):
   ```bash
   sudo sh -c 'echo "127.0.0.1       neuros.local" >> /etc/hosts'
   ```

2. **Start dev server** (Terminal 1):
   ```bash
   npm run dev:local
   ```

3. **Start proxy** (Terminal 2 - requires sudo):
   ```bash
   npm run proxy:80
   ```

4. **Access the site**:
   Open your browser and navigate to: `http://neuros.local` (no port!)

### Option 2: Port Forwarding with pfctl
1. **Enable port forwarding**:
   ```bash
   ./setup-port-80.sh enable
   ```

2. **Start dev server**:
   ```bash
   npm run dev:local
   ```

3. **Access the site**:
   Open your browser and navigate to: `http://neuros.local`

## Standard Setup (Port 3001)

1. **Run the setup script** (requires sudo password):
   ```bash
   ./setup-local-domain.sh
   ```

2. **Start the development server**:
   ```bash
   npm run dev:local
   ```

3. **Access the site**:
   Open your browser and navigate to: `http://neuros.local:3001`

## Manual Setup (if script doesn't work)

### Step 1: Add to hosts file
Add this line to your `/etc/hosts` file:
```
127.0.0.1       neuros.local
```

You can do this manually:
```bash
sudo nano /etc/hosts
# Add the line above, save and exit
```

### Step 2: Run the dev server
Use the special local dev command that binds to all interfaces:
```bash
npm run dev:local
```

This runs `next dev -H 0.0.0.0 -p 3001`

## Available Scripts

- `npm run dev` - Standard development server (localhost:3000)
- `npm run dev:local` - Development server accessible via neuros.local:3001
- `npm run dev:80` - Development server on port 80 (requires sudo)
- `npm run proxy:80` - Proxy server to forward port 80 to 3001 (requires sudo)

## Troubleshooting

### Browser can't find neuros.local
1. Verify the hosts file entry exists:
   ```bash
   cat /etc/hosts | grep neuros.local
   ```
2. Clear your DNS cache:
   ```bash
   sudo dscacheutil -flushcache  # macOS
   ```

### Port already in use
If port 3001 is already in use, you can specify a different port:
```bash
next dev -H 0.0.0.0 -p 3002
```

Then access via: `http://neuros.local:3002`

### SSL/HTTPS Setup (Optional)
For HTTPS development, consider using tools like:
- [mkcert](https://github.com/FiloSottile/mkcert) for local SSL certificates
- [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy)

## Benefits of Using neuros.local

1. **Consistent Development URL**: More professional than localhost
2. **Better Cookie Handling**: Some auth systems work better with named domains
3. **Production-like Environment**: Closer to how the app behaves in production
4. **Multiple Projects**: Easy to distinguish between different local projects
# Fly.io Deployment Guide

This guide will help you deploy the Crown and Skull GM Webapp to fly.io.

## Prerequisites

1. Install the fly.io CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up or login to fly.io:
   ```bash
   fly auth signup
   # or if you already have an account
   fly auth login
   ```

## Deployment Steps

### 1. Launch the app (first time only)

The `fly.toml` configuration is already set up. To create the app on fly.io:

```bash
fly launch --no-deploy
```

When prompted:
- Choose an app name (or press Enter to use the default: `cncphaser`)
- Select a region (default: San Jose `sjc`)
- Don't add a PostgreSQL database (we don't need one)
- Don't add Redis (we don't need it)

### 2. Deploy the application

```bash
fly deploy
```

This will:
- Build the Docker container
- Generate templ files during build
- Compile the Go application
- Deploy to fly.io

### 3. Open your app

```bash
fly open
```

This will open your deployed app in your default browser.

## Useful Commands

### View logs
```bash
fly logs
```

### Check app status
```bash
fly status
```

### Scale your app
```bash
# Scale to 1 machine minimum (always running)
fly scale count 1

# Scale back to 0 (auto-start on request)
fly scale count 0 --max-per-region 1
```

### Update environment variables (if needed)
```bash
fly secrets set KEY=value
```

### Redeploy after code changes
```bash
fly deploy
```

## Configuration Details

- **App name**: `cncphaser` (can be changed in fly.toml)
- **Region**: San Jose (`sjc`) - change in fly.toml if needed
- **Port**: 8080 (internal)
- **Memory**: 256MB
- **CPU**: 1 shared CPU
- **Auto-sleep**: Enabled (stops when idle to save costs)

## Troubleshooting

### Build fails
Check that you have `go.mod` and `go.sum` in your repository.

### App won't start
Check logs with `fly logs` to see startup errors.

### Static files not loading
Verify that the `static` directory is being copied in the Dockerfile.

## Cost

With the current configuration (auto-sleep enabled, 256MB RAM), the app will run on fly.io's free tier. It will automatically stop when idle and start when accessed.

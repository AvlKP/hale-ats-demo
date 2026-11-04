# HALE ATS — Local demo

A standalone copy of the current HALE mission-control prototype, including event pagination and the expanded hardware-administration Config page.

## Quick start — Node.js

Requires Node.js 18 or newer. No dependency installation or build step is needed.

1. Extract this ZIP.
2. Open a terminal in the extracted `HALE-ATS-Local` folder.
3. Run:

   ```sh
   npm start
   ```

4. Open **http://127.0.0.1:8080** in your browser.
5. Press **Ctrl+C** in the terminal to stop the server.

You can also run `node start.mjs` directly. If port 8080 is occupied:

```sh
npm start -- --port 8081
```

Then open http://127.0.0.1:8081.

## Alternative — Python

If you have Python 3.8+ instead of Node.js:

```sh
python3 start.py
```

On Windows, use `py -3 start.py` or `python start.py` if appropriate for your installation.

To choose another port: `python3 start.py --port 8081`.

Both launchers work regardless of the terminal's working directory when invoked using their full paths. They serve only the `web` folder and bind to this computer's loopback address.

## What is included

- Mission Overview with a Leaflet map, animated aircraft, five waypoints, flight path, backhaul link and coverage overlays.
- Network views, static Chart.js charts, hardware Status and Reports.
- Simulated events every 10 seconds while running, event filters, pagination, acknowledgement and CSV export.
- PowerBeam as ground AP and LiteAP as airborne Station, with separate airOS-style configuration profiles.
- RouterOS configuration for the 2.4 GHz R11e-2HPnD service radio; its host model is unspecified.
- Configuration staging, validation, review, a 180-second test/rollback cycle, diagnostics, demo JSON backup/restore and change history.
- Source JavaScript, CSS, HTML, images and bundled browser libraries.

## Network and data behavior

The app runs locally without ChatGPT sign-in, API keys, a database, npm downloads or a backend service.

**An internet connection is needed for map basemap tiles.** Satellite tiles come from Esri; street tiles come from OpenStreetMap. If unavailable, the overlays remain interactive but the geographic basemap may be blank. All application code and browser libraries are included in this ZIP.

Charts and telemetry are sample data. Aircraft movement, device configuration, diagnostics, reboots and link checks are simulated. This app does not connect to or configure physical hardware.

Saved configuration and administration history live in this browser's local storage. Reloading resets the event log and flight progress; saved device settings persist. The hosted site and this local copy have separate browser storage. Use the same local URL and port to keep accessing the same saved settings.

To reset demo settings, clear site data for http://127.0.0.1:8080 using your browser's site settings. Export any demo configuration backups you want to retain first.

Export PDF opens the browser's print dialog; select **Save as PDF**. Config backups use the ATS demo JSON format, not vendor-native backup formats. Backup exports omit credentials.

## Editing

- `web/index.html` — application shell and script loading.
- `web/style.css` — layout and styling.
- `web/app.js` — mission map, charts, event simulation, pagination and navigation.
- `web/config.js` — hardware profiles and configuration workflows.
- `web/assets/` — bundled Leaflet 1.9.4, Chart.js 4.4.8 and design assets.
- `start.mjs` / `start.py` — local launchers; use either one.

Edit a file under `web/`, then refresh the browser. No build step is needed. Run through a local server rather than double-clicking `index.html`.

Firmware references are pinned to airOS 8.7.25 and RouterOS 7.25.1 stable, checked on 4 November 2026. This package does not include firmware binaries or perform firmware updates.

## Snapshot

Source commit: `7418c8723a72381553c8e65a958174af2426cc22`.

The archive omits deployment metadata, repository history, credentials and machine-specific runtime state. Third-party library notices are in `THIRD_PARTY_NOTICES.txt`; existing inline library notices are preserved.

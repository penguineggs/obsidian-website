let detectedOS = (function () {
	let appVersion = navigator.appVersion;
	if (appVersion.indexOf('Win') !== -1) {
		return 'Windows';
	}
	if (appVersion.indexOf('Mac') !== -1) {
		return 'MacOS';
	}
	if (appVersion.indexOf('X11') !== -1) {
		return 'Linux';
	}
	if (appVersion.indexOf('Linux') !== -1) {
		return 'Linux';
	}
	return 'Unknown OS';
})();

let osDownloadInfo = {
	'Windows': {
		buttonName: 'Windows',
		descriptionName: 'Windows',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.12.19/Obsidian.0.12.19.exe'
	},
	'MacOS': {
		buttonName: 'macOS',
		descriptionName: 'macOS',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.12.19/Obsidian-0.12.19-universal.dmg',
	},
	'Linux': {
		buttonName: 'Linux (AppImage)',
		descriptionName: 'Linux (AppImage)',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.12.19/Obsidian-0.12.19.AppImage'
	},
	'Linux-Snap': {
		buttonName: 'Linux',
		descriptionName: 'Linux (Snap)',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.12.19/obsidian_0.12.19_amd64.snap'
	},
	'Linux-Flatpak': {
		buttonName: 'Linux',
		descriptionName: 'Linux (Flatpak)',
		downloadLink: 'https://flathub.org/apps/details/md.obsidian.Obsidian'
	}
};

let allPlatforms = ['Windows', 'MacOS', 'Linux', 'Linux-Snap', 'Linux-Flatpak'];

if (detectedOS !== 'Windows' && detectedOS !== 'Unknown OS') {
	let downloadData = osDownloadInfo[detectedOS];

	fishAll('.download-os').forEach(el => el.setText(downloadData.buttonName));
	fishAll('.download-button').forEach(el => el.setAttribute('href', downloadData.downloadLink));

	let otherOs = allPlatforms.slice();
	otherOs.remove(detectedOS);

	for (let i = 0; i < otherOs.length; i++) {
		let os = otherOs[i];
		let alt_os_data = osDownloadInfo[os];
		// because anchor tag has their own text property
		fishAll(`.alt-os-${i + 1}`).forEach(el => {
			el.setText(alt_os_data.descriptionName);
			el.setAttribute('href', alt_os_data.downloadLink);
		});
	}
}

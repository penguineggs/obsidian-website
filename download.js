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
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.8.9/Obsidian.0.8.9.exe'
	},
	'MacOS': {
		buttonName: 'macOS',
		descriptionName: 'macOS',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.8.9/Obsidian-0.8.9.dmg',
	},
	'Linux': {
		buttonName: 'Linux',
		descriptionName: 'Linux (AppImage)',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.8.9/Obsidian-0.8.9.AppImage'
	},
	'Linux-Snap': {
		buttonName: 'Linux',
		descriptionName: 'Linux (Snap)',
		downloadLink: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.8.9/obsidian_0.8.9_amd64.snap'
	}
};

let allPlatforms = ['Windows', 'MacOS', 'Linux', 'Linux-Snap'];

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

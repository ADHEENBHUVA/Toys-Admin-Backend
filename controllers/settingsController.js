const WebsiteSettings = require('../models/WebsiteSettings');

exports.getSettings = async (req, res) => {
    try {
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSocialLinks = async (req, res) => {
    try {
        const { facebook, instagram, youtube, twitter } = req.body;
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
        }
        
        settings.socialLinks = {
            facebook: facebook || '',
            instagram: instagram || '',
            youtube: youtube || '',
            twitter: twitter || ''
        };
        
        await settings.save();
        res.json({ message: 'Social links updated successfully', settings });
    } catch (error) {
        console.error('Error updating social links:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

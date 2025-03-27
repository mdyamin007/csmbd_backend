const { Content } = require('../models');
const { contentSchema } = require('../validations/contentvalidations');

exports.createContent = async (req, res) => {
  try {
    const { error, value } = contentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const newContent = await Content.create({
      title: value.title,
      description: value.description,
      youtubeLink: value.youtubeLink,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Content created successfully', content: newContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (content.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this content' });
    }

    const { error, value } = contentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await content.update(value);
    res.json({ message: 'Content updated successfully', content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (content.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this content' });
    }

    await content.destroy();
    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserContents = async (req, res) => {
  try {
    // For a given userId (could be req.params.userId for public viewing)
    const contents = await Content.findAll({ where: { userId: req.params.userId } });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

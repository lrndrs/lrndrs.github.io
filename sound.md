---
layout: default
title: Sound
permalink: /sound/
---

# Sound

Before moving into climate geology, I trained and worked as a sound engineer and
sound designer (MA Tonmeister, Universität für Musik und Darstellende Kunst Wien;
BSc Sound Engineering, Zürcher Hochschule der Künste). I worked on more than 25
cinema/TV productions and specialised in sound design for live productions in
contemporary music and performance, including as Sound Director for the
International Ensemble Modern Academy (IEMA), Frankfurt.

## Selected Projects

<div class="repo-grid">
{% for p in site.data.sound.projects %}
  <div class="repo-card">
    <h3><a href="{{ p.url }}" target="_blank" rel="noopener">{{ p.name }}</a></h3>
    {% if p.description %}<p>{{ p.description }}</p>{% endif %}
    <span class="repo-tag">{{ p.role }}{% if p.year %} · {{ p.year }}{% endif %}</span>
  </div>
{% endfor %}
</div>

{% if site.data.sound.projects.size == 0 %}
<p><em>Project links coming soon.</em></p>
{% endif %}

To add or remove entries, edit `_data/sound.yml`.

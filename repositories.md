---
layout: default
title: Repositories
permalink: /repositories/
---

# Selected Repositories

Code for my papers, the SISAL data stewardship tools and teaching materials.
Everything else is on [GitHub](https://github.com/{{ site.github_user }}?tab=repositories).

## Research Code

<div class="repo-grid">
{% for r in site.data.repos.research_code %}
  <div class="repo-card">
    <h3><a href="https://github.com/{{ r.owner | default: site.github_user }}/{{ r.repo }}" target="_blank" rel="noopener">{{ r.name }}</a></h3>
    <p>{{ r.description }}</p>
    <span class="repo-tag">{{ r.language }}</span>
  </div>
{% endfor %}
</div>

## Data Stewardship (SISAL)

<div class="repo-grid">
{% for r in site.data.repos.data_stewardship %}
  <div class="repo-card">
    <h3><a href="https://github.com/{{ r.owner | default: site.github_user }}/{{ r.repo }}" target="_blank" rel="noopener">{{ r.name }}</a></h3>
    <p>{{ r.description }}</p>
    <span class="repo-tag">{{ r.language }}</span>
  </div>
{% endfor %}
</div>

## Teaching Resources

<div class="repo-grid">
{% for r in site.data.repos.teaching_resources %}
  <div class="repo-card">
    <h3><a href="https://github.com/{{ r.owner | default: site.github_user }}/{{ r.repo }}" target="_blank" rel="noopener">{{ r.name }}</a></h3>
    <p>{{ r.description }}</p>
    <span class="repo-tag">{{ r.language }}</span>
  </div>
{% endfor %}
</div>

(function () {
  const script = document.currentScript;
  const orcid = script.getAttribute("data-orcid");
  const statusEl = document.getElementById("pub-status");
  const listEl = document.getElementById("pub-list");

  const TYPE_LABELS = {
    "journal-article": "Journal Article",
    "preprint": "Preprint",
    "conference-paper": "Conference",
    "conference-abstract": "Conference",
    "dataset": "Dataset",
    "other": "Other",
  };

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function bestExternalLink(externalIds) {
    if (!externalIds || !externalIds["external-id"]) return null;
    const ids = externalIds["external-id"];
    const doi = ids.find((id) => id["external-id-type"] === "doi");
    const chosen = doi || ids[0];
    if (!chosen) return null;
    return chosen["external-id-url"] ? chosen["external-id-url"].value : null;
  }

  function doiOf(w) {
    const ids = w["external-ids"] && w["external-ids"]["external-id"];
    if (!ids) return null;
    const doi = ids.find((id) => id["external-id-type"] === "doi");
    return doi ? doi["external-id-value"].toLowerCase() : null;
  }

  // ORCID's public API doesn't expose the "Featured works" flag, so the DOIs
  // below mirror what's currently pinned as Featured on the ORCID profile.
  // Update this list by hand if the featured selection changes on ORCID.
  const FEATURED_DOIS = [
    "10.5194/cp-22-797-2026",
    "10.1017/qua.2023.41",
    "10.5194/egusphere-egu25-18390",
    "10.5194/egusphere-egu26-21023",
  ].map((d) => d.toLowerCase());

  // Site-only pin, independent of ORCID's Featured flag — always sorts to the
  // very top, above Featured works. Not marked "Featured" since ORCID itself
  // doesn't show it as such; update/remove by hand as needed.
  const PINNED_DOIS = ["10.22541/essoar.15007256/v1"].map((d) => d.toLowerCase());

  fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
    headers: { Accept: "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`ORCID API returned ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const groups = data.group || [];
      const works = groups.map((g) => g["work-summary"][0]).filter(Boolean);

      function yearOf(w) {
        const pd = w["publication-date"];
        return pd && pd.year ? parseInt(pd.year.value, 10) : 0;
      }

      function isFeatured(w) {
        const doi = doiOf(w);
        return doi ? FEATURED_DOIS.includes(doi) : false;
      }

      function isPinned(w) {
        const doi = doiOf(w);
        return doi ? PINNED_DOIS.includes(doi) : false;
      }

      works.sort((a, b) => {
        const pinA = isPinned(a) ? 1 : 0;
        const pinB = isPinned(b) ? 1 : 0;
        if (pinA !== pinB) return pinB - pinA;
        const featA = isFeatured(a) ? 1 : 0;
        const featB = isFeatured(b) ? 1 : 0;
        if (featA !== featB) return featB - featA;
        return yearOf(b) - yearOf(a);
      });

      if (works.length === 0) {
        statusEl.textContent = "No publications found on ORCID.";
        return;
      }

      statusEl.remove();
      listEl.innerHTML = works
        .map((w) => {
          const title = w.title && w.title.title ? w.title.title.value : "Untitled";
          const year =
            w["publication-date"] && w["publication-date"].year
              ? w["publication-date"].year.value
              : "n.d.";
          const journal = w["journal-title"] ? w["journal-title"].value : "";
          const type = TYPE_LABELS[w.type] || w.type || "";
          const link = bestExternalLink(w["external-ids"]) || (w.url ? w.url.value : null);
          const featured = isFeatured(w);
          const pinned = isPinned(w);

          const titleHtml = link
            ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(title)}</a>`
            : escapeHtml(title);

          let tagHtml = "";
          if (pinned) {
            tagHtml = `<span class="pub-featured-tag" title="Pinned to top on this site">★ Latest</span>`;
          } else if (featured) {
            tagHtml = `<span class="pub-featured-tag" title="Featured on ORCID">★ Featured</span>`;
          }

          return `<li class="pub-item${featured || pinned ? " pub-featured" : ""}">
            ${tagHtml}
            <span class="pub-year">${escapeHtml(year)}</span>
            <span class="pub-title">${titleHtml}</span>
            ${type ? `<span class="pub-type-tag">${escapeHtml(type)}</span>` : ""}
            ${journal ? `<div class="pub-meta">${escapeHtml(journal)}</div>` : ""}
          </li>`;
        })
        .join("");
    })
    .catch((err) => {
      statusEl.textContent =
        "Couldn't load publications from ORCID right now. View them directly on ";
      const link = document.createElement("a");
      link.href = `https://orcid.org/${orcid}`;
      link.textContent = "ORCID";
      link.target = "_blank";
      link.rel = "noopener";
      statusEl.appendChild(link);
      statusEl.append(".");
      console.error("ORCID fetch failed:", err);
    });
})();

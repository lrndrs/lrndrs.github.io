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

      works.sort((a, b) => yearOf(b) - yearOf(a));

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

          const titleHtml = link
            ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(title)}</a>`
            : escapeHtml(title);

          return `<li class="pub-item">
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

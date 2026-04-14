# Archived Changes Exploration Design

## Landing Page Integration

### Archived Changes Section

```
[Existing Active Changes Table]

▼ Explore Archives (expandable)
┌─────────────────────────────────────────┐
│ Search: [_______________] [Filters ▼]   │
│                                         │
│ Quick Browse:                           │
│ • Recent Archives                       │
│ • By Domain                             │
│ • By Tag                                │
│                                         │
│ Visualizations:                         │
│ • Timeline View                         │
│ • Domain Heatmap                        │
└─────────────────────────────────────────┘
```

### Search and Filter Design

**Filter Options:**
- Domain area (authentication, frontend, backend, etc.)
- Date range (last month, quarter, year, custom)
- Change type (feature, refactor, fix, spike)
- Tags and labels
- Team/author

**Search Behavior:**
- Default: search only active changes and documentation
- Opt-in toggle: "Include archived changes"
- Separate archive-only search in Explore Archives section

## Individual Archive Pages

### Enhanced Archive Page Layout

```
[Standard archived change content]

┌─── Related & Follow-up ───────────────┐
│                                       │
│ 🔗 Related Changes                    │
│ • Similar change from Q2              │
│ • Authentication refactor series      │
│ • [Auto-suggested based on tags]      │
│                                       │
│ 📈 Evolution Timeline                 │
│ [Visual timeline if part of series]   │
│                                       │
│ ➕ Actions                            │
│ [Propose Follow-up Change] [Share]    │
└───────────────────────────────────────┘
```

### Related Changes Algorithm

**Manual Relatedness:**
- Authors can specify related changes when archiving
- Reviewers can suggest additional connections
- Bidirectional linking (if A relates to B, show A on B's page)

**Automatic Inference:**
- Shared tags and labels
- Similar file paths modified
- Chronological proximity in same domain
- Text similarity in proposals/descriptions
- Author/team overlap

**Hybrid Approach:**
- Auto-suggest related changes during archive process
- Authors confirm or add additional connections
- Community can suggest new relationships over time

## Visualization Components

### Timeline View
- Horizontal timeline showing changes over time
- Color-coded by domain or change type  
- Clickable points expand to show change summary
- Filter by date range, domain, or team

### Domain Heatmap
- Grid showing domains vs. time periods
- Cell intensity indicates number of archived changes
- Quick visual of "where has work been focused?"
- Click cells to drill into specific domain/timeframe

## Follow-up Change Flow

### "Propose Follow-up" Action
1. Click "Propose Follow-up" on archived change
2. Pre-populate new change with:
   - Reference to source archived change
   - Relevant context and background
   - Suggested tags/domain classification
3. Standard OpenSpec change creation flow
4. Maintain linkage between original and follow-up

## Mobile Considerations

- Collapsible sections for small screens
- Simplified filter interface
- Touch-friendly timeline navigation
- Essential information prioritized in limited space

## Performance Considerations

- Lazy load archive content (don't fetch until Explore Archives expanded)
- Paginate search results
- Cache relationship calculations
- Index archive content for fast search
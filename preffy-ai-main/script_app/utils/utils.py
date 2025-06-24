def sliding_window(
    iterable, 
    window_size, 
    window_overlap=0,
    include_last_window=True
):
    """
    Create an iterable that yields windows of a specified size from the input iterable.
    
    Parameters:
    - iterable: The input iterable to create windows from.
    - window_size: The size of each window.
    - overlap: The number of overlapping elements between consecutive windows.
    - include_last_window: Whether to include the last window even if it is smaller than window_size.
    
    Yields:
    - A list containing the elements of the current window.
    """
    start = 0
    while start < len(iterable):
        end = start + window_size
        if end > len(iterable):
            if include_last_window:
                yield iterable[start:]
            break
        yield iterable[start:end]
        start += (window_size - window_overlap)